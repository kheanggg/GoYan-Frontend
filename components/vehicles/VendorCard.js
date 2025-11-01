export default function VendorCard({ profile="/images/vendor/heritage_motor.png", name }) {
    return (
        <div className="flex items-center gap-3">
            {/* Profile Image */}
            <img
                src={profile}
                className="w-10 h-10 rounded-full object-cover border"
            />

            {/* Vendor Name */}
            <div className="flex-1">
                <h3 className="text-md text-gray-500">{name}</h3>
            </div>
        </div>
    );
}
