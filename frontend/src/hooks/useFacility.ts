import { useQuery } from "@tanstack/react-query";
import { getFacilities } from "../api/facility";
import type { Facility } from "../types/types";

export function useFacilities() {
    return useQuery<Facility[]>({
        queryKey: ["facilities"],
        queryFn: getFacilities,
    })
}
