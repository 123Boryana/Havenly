import AdForm from "../../../components/forms/AdForm";

export default function SellHouse() {
    return (
        <div>
            
            <h1 className="display-1 bg-primary text-light p-5">
                Къща за продан
            </h1>
            <div className="container mt-2">
                <AdForm action="Sell" type="House" />
            </div>
        </div>
    );
}