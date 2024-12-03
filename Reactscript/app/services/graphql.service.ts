import { Http } from '@nativescript/core';
import type { Estimate, UpdateItem } from '../types';

export class GraphQLService {
  private static instance: GraphQLService;
  private baseUrl = 'https://4ea3-39-61-50-47.ngrok-free.app/graphql';
  
  private constructor() {}

  static getInstance(): GraphQLService {
    if (!GraphQLService.instance) {
      GraphQLService.instance = new GraphQLService();
    }
    return GraphQLService.instance;
  }

  async query<T>(query: string, variables: any = {}): Promise<T> {
    try {
      const response = await Http.request({
        url: this.baseUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        content: JSON.stringify({
          query,
          variables,
        }),
      });

      const result = response.content.toJSON();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      return result.data;
    } catch (error) {
      console.error('GraphQL Error:', error);
      throw error;
    }
  }

  async getEstimates() {
    const query = `
      query GetEstimates {
        estimates {
          id
          customerName
          contactNumber
          address
          location
          appointmentTime
          voiceNote
          mechanicStatus
          pdfUrl
          total
          items {
            id
            sku
            name
            quantity
            price
          }
        }
      }
    `;

    return this.query<{ estimates: Estimate[] }>(query);
  }

  async getEstimate(id: number) {
    const query = `
      query GetEstimate($id: Int!) {
        estimate(id: $id) {
          id
          customerName
          contactNumber
          address
          location
          appointmentTime
          voiceNote
          mechanicStatus
          pdfUrl
          total
          items {
            id
            sku
            name
            quantity
            price
          }
        }
      }
    `;

    return this.query<{ estimate: Estimate }>(query, { id });
  }

  async updateEstimateItems(id: number, items: UpdateItem[]) {
    const mutation = `
      mutation UpdateEstimateItems($id: Int!, $items: [UpdateItem!]!) {
        updateEstimateItems(id: $id, items: $items) {
          id
          mechanicStatus
          items {
            id
            quantity
          }
        }
      }
    `;

    return this.query<{ updateEstimateItems: Estimate }>(mutation, { id, items });
  }

  async updateMechanicStatus(id: number, mechanicStatus: boolean) {
    const mutation = `
      mutation UpdateMechanicStatus($id: Int!, $mechanicStatus: Boolean!) {
        updateMechanicStatus(id: $id, mechanicStatus: $mechanicStatus) {
          id
          mechanicStatus
        }
      }
    `;

    return this.query<{ updateMechanicStatus: Estimate }>(mutation, { id, mechanicStatus });
  }
}