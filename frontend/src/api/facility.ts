import type { Facility } from "../types/types";

export async function getFacilities(): Promise<Facility[]> {
    try {
        const response = await fetch("/api/facilities/");
        if (!response.ok) {
            throw new Error("Błąd pobierania boisk");
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error("Wystąpił błąd w funkcji getFacilities", error);
        throw error;
    }
}