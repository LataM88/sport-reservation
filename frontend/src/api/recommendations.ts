import { apiClient } from './apiClient';
import type { RecommendedFacility } from '../types/types';

export async function getRecommendations(limit = 3): Promise<RecommendedFacility[]> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return apiClient<RecommendedFacility[]>(`/api/recommendations/?limit=${limit}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}
