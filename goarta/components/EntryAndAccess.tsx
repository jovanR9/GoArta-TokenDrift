import React from "react";

interface EntryAndAccessProps {
  entryType?: string;
  ticketOptions?: Array<{ type: string; price: number; description: string }>;
}

const EntryAndAccess: React.FC<EntryAndAccessProps> = ({
  entryType,
  ticketOptions,
}) => {
  return (
    <div className="w-full p-4 bg-[#F4EEFC] rounded-xl border border-black mt-8">
      <h3 className="text-2xl font-playfair font-bold mb-3">Entry and Access</h3>

      {entryType && (
        <div className="mb-4">
          <h4 className="text-xl font-semibold mb-2">Entry Type: <span className="font-normal">{entryType}</span></h4>
        </div>
      )}

      {ticketOptions && ticketOptions.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold mb-2">Ticket Options:</h4>
          <ul className="list-disc list-inside ml-4 text-gray-700">
            {ticketOptions.map((option, index) => (
              <li key={index}><span className="font-medium">{option.type}</span> – ₹{option.price} {option.description}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EntryAndAccess;