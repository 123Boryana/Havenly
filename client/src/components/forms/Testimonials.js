import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";

const TestimonialsSection = () => {
    const [auth] = useAuth();
    const [testimonials, setTestimonials] = useState([]);
    const [comment, setComment] = useState("");
    const [error, setError] = useState(null);

    const baseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const headers = auth?.token ? { Authorization: auth.token } : {};
            const response = await axios.get(`${baseURL}/api/testimonials`, { headers });
            const { data } = response;
            setTestimonials(data);
        } catch (error) {
            console.error("Error fetching testimonials:", error.message);
            console.error("Full error:", error.response);
            setError(
                error.response?.data?.details ||
                "Грешка при зареждането на отзиви. Провери бекенда."
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!auth?.user) {
            setError("Моля, влезте в профила си, за да оставите отзив.");
            return;
        }
        if (!comment) {
            setError("Моля, напишете отзив.");
            return;
        }

        try {
            const headers = auth?.token ? { Authorization: auth.token } : {};
            const response = await axios.post(
                `${baseURL}/api/testimonials`,
                { text: comment },
                { headers }
            );
            const { data } = response;
            setTestimonials([data, ...testimonials]);
            setComment("");
            setError(null);
        } catch (error) {
            console.error("Error posting testimonial:", error.message);
            console.error("Full error:", error.response);
            setError(
                error.response?.data?.details ||
                "Грешка при добавянето на отзив. Провери бекенда."
            );
        }
    };

    const handleDelete = async (id) => {
        try {
            console.log("Deleting testimonial with ID:", id);
            console.log("Current user ID:", auth?.user?._id);
            const headers = auth?.token ? { Authorization: auth.token } : {};
            await axios.delete(`${baseURL}/api/testimonials/${id}`, { headers });
            console.log("Testimonial deleted, updating state...");
            setTestimonials(testimonials.filter((t) => t._id !== id));
        } catch (error) {
            console.error("Error deleting testimonial:", error.message);
            console.error("Full error:", error.response);
            setError(
                error.response?.data?.details ||
                "Грешка при изтриването на отзив. Провери бекенда."
            );
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-center">Отзиви за Havenly</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                <div className="col-md-6" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {testimonials.length > 0 ? (
                        testimonials.map((testimonial) => (
                            <div key={testimonial._id} className="card mb-3 shadow-sm">
                                <div className="card-body">
                                    <p className="fst-italic mb-2">"{testimonial.text}"</p>
                                    <small className="text-muted d-block text-end">
                                        - {testimonial.username || "Анонимен"} (
                                        {new Date(testimonial.date).toLocaleDateString("bg-BG")})
                                    </small>
                                    {auth?.user && (testimonial.user?._id || testimonial.user) === auth.user._id && (
                                        <button
                                            className="btn btn-danger btn-sm mt-2"
                                            onClick={() => handleDelete(testimonial._id)}
                                        >
                                            Изтрий
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted">Все още няма отзиви. Бъди първият!</p>
                    )}
                </div>

                <div className="col-md-6">
                    <form onSubmit={handleSubmit} className="mb-4">
                        <textarea
                            placeholder="Остави отзив"
                            className="form-control mb-2"
                            rows="5"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={!auth?.user}
                        />
                        {auth?.user ? (
                            <button type="submit" className="btn btn-primary w-100">
                                Публикувай
                            </button>
                        ) : (
                            <p className="text-muted text-center">
                                <a href="/login">Влезте в профила си</a>, за да оставите отзив.
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSection;