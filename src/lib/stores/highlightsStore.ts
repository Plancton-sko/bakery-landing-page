// src/lib/stores/highlightsStore.ts
import { writable } from 'svelte/store';
import type { Highlight } from '$lib/types/Highlight';
import { config } from '$lib/services/config';

// Store principal para os highlights
export const highlights = writable<Highlight[]>([]);

// Loading state para o admin
export const highlightsLoading = writable<boolean>(false);

// Error state
export const highlightsError = writable<string>('');

// Success state
export const highlightsSuccess = writable<string>('');

// Função para buscar highlights do backend
export async function fetchHighlights(): Promise<Highlight[]> {
    highlightsLoading.set(true);
    highlightsError.set('');
    
    try {
        const response = await fetch(`${config.baseUrl}/highlights`, { credentials: 'include' });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        highlights.set(data);
        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar highlights';
        highlightsError.set(errorMessage);
        throw error;
    } finally {
        highlightsLoading.set(false);
    }
}

// Função para salvar highlights
export async function saveHighlights(highlightData: any[]): Promise<void> {
    highlightsLoading.set(true);
    highlightsError.set('');
    highlightsSuccess.set('');
    
    try {
        const response = await fetch(`${config.baseUrl}/highlights`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ highlights: highlightData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao salvar highlights');
        }

        const updatedHighlights = await response.json();
        highlights.set(updatedHighlights);
        highlightsSuccess.set('Highlights salvos com sucesso!');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar highlights';
        highlightsError.set(errorMessage);
        throw error;
    } finally {
        highlightsLoading.set(false);
    }
}

// Função para remover um highlight
export async function removeHighlight(productId: string): Promise<void> {
    highlightsLoading.set(true);
    highlightsError.set('');
    highlightsSuccess.set('');
    
    try {
        const response = await fetch(`${config.baseUrl}/highlights/${productId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao remover highlight');
        }

        // Atualizar o store removendo o highlight
        highlights.update(currentHighlights => 
            currentHighlights.filter(h => h.id !== productId)
        );
        
        highlightsSuccess.set('Highlight removido com sucesso!');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao remover highlight';
        highlightsError.set(errorMessage);
        throw error;
    } finally {
        highlightsLoading.set(false);
    }
}

// Função para limpar mensagens
export function clearMessages(): void {
    highlightsError.set('');
    highlightsSuccess.set('');
}