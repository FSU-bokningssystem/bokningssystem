import { X, Plus } from "lucide-react";

const RoomModal = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const values = Object.fromEntries(formData);
    console.log(values);
    props.submitData(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 md:pb-5">
          <h3 className="text-lg font-medium text-gray-900">Lägg till lokal</h3>
          <button
            onClick={props.onClose}
            type="button"
            className="ms-auto inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Stäng</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4 md:py-6">
            <div className="col-span-2">
              <label
                htmlFor="rumsnummer"
                className="mb-2.5 block text-sm font-medium text-gray-900"
              >
                Rumsnummer
              </label>
              <input
                type="number"
                name="roomNumber"
                id="rumsnummer"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500"
                placeholder="Rumsnummer"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="floor"
                className="mb-2.5 block text-sm font-medium text-gray-900"
              >
                Våning
              </label>
              <input
                type="number"
                name="floor"
                id="floor"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500"
                placeholder="(valfritt)"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="rumsnamn"
                className="mb-2.5 block text-sm font-medium text-gray-900"
              >
                Rumsnamn
              </label>
              <input
                type="text"
                name="name"
                id="rumsnamn"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500"
                placeholder="Lilla mötesrummet"
                required
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="description"
                className="mb-2.5 block text-sm font-medium text-gray-900"
              >
                Beskrivning
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500"
                placeholder="Kort beskrivning av lokalen"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="houseId"
                className="mb-2.5 block text-sm font-medium text-gray-900"
              >
                HusId behövs tydligen
              </label>
              <input
                type="number"
                name="houseId"
                id="rumsnamn"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500"
                placeholder="1"
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center space-x-4 border-t border-gray-200 pt-4 md:pt-6">
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-green-500 px-4 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              <Plus className="-ms-0.5 me-1.5 h-4 w-4" />
              Lägg till
            </button>
            <button
              onClick={props.onClose}
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200"
            >
              {" "}
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RoomModal;
