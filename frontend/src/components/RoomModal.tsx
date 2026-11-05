import { X, Plus, Save } from "lucide-react";
import type { RoomModalProps, roomFormValues } from "../types/types";
import type React from "react";

const RoomModal = ({ onClose, submitData, room, error }: RoomModalProps) => {
    const isEditing = !!room;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const floor = formData.get("floor") as string;
        const values: roomFormValues = {
            roomNumber: formData.get("roomNumber") as string,
            floor: floor ? Number(floor) : null,
            name: formData.get("name") as string,
            description: formData.get("description") as string,
        };
        if (isEditing) {
            values.isAvailable = formData.get("isAvailable") === "on";
        }
        submitData(values);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                        {isEditing ? "Redigera lokal" : "Lägg till lokal"}
                    </h3>
                    <button
                        onClick={onClose}
                        type="button"
                        className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Stäng</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label
                            htmlFor="rumsnummer"
                            className="block text-xs font-bold text-gray-700 uppercase mb-1"
                        >
                            Rumsnummer
                        </label>
                        <input
                            type="text"
                            name="roomNumber"
                            id="rumsnummer"
                            defaultValue={room?.roomNumber ?? ""}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
                            placeholder="Ex. 101"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="floor"
                                className="block text-xs font-bold text-gray-700 uppercase mb-1"
                            >
                                Våning
                            </label>
                            <input
                                type="number"
                                name="floor"
                                id="floor"
                                defaultValue={room?.floor ?? ""}
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
                                placeholder="(valfritt)"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="rumsnamn"
                                className="block text-xs font-bold text-gray-700 uppercase mb-1"
                            >
                                Rumsnamn
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="rumsnamn"
                                defaultValue={room?.name ?? ""}
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
                                placeholder="Ex. Konferensrum"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-xs font-bold text-gray-700 uppercase mb-1"
                        >
                            Beskrivning
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            rows={3}
                            defaultValue={room?.description ?? ""}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
                            placeholder="Kort beskrivning..."
                            required
                        />
                    </div>

                    {isEditing && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isAvailable"
                                id="isAvailable"
                                defaultChecked={room.isAvailable}
                                className="h-4 w-4 rounded border-gray-300 text-[#0058a3] focus:ring-[#0058a3]"
                            />
                            <label
                                htmlFor="isAvailable"
                                className="text-sm font-medium text-gray-700"
                            >
                                Bokningsbar
                            </label>
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-red-600" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-4">
                        <button
                            onClick={onClose}
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition"
                        >
                            Avbryt
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-[#0058a3] hover:bg-[#004f93] rounded-full transition shadow-xs"
                        >
                            {isEditing ? (
                                <Save className="h-4 w-4" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                            {isEditing ? "Spara" : "Lägg till"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default RoomModal;
