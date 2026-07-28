import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '../api/recommendations';
import type { RecommendedFacility } from '../types/types';

export function useRecommendations(limit = 3) {
    return useQuery<RecommendedFacility[]>({
        queryKey: ['recommendations', limit],
        queryFn: () => getRecommendations(limit),
    });
}
