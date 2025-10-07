import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface TokenWhalesReport {
  report_for_24h: string;
  report_for_168h: string;
  comparison_report: string;
  exception: string | null;
}

export const useTokenWhalesActivity = (address: string, isEnabled: boolean) => {
  const baseUrl = process.env.NEXT_PUBLIC_AGENT_SERVER_URL;
  return useQuery<TokenWhalesReport>({
    queryKey: ["token-whales-activity", address],
    enabled: isEnabled,
    retry: 3,
    refetchOnWindowFocus: false,
    gcTime: 300000,
    refetchInterval: 3 * 60 * 1000,
    staleTime: 3 * 60 * 1000, // 3 minutes
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    queryFn: async () => {
      try {
        const payload = { token_address: address };
        const response = await axios.post(
          `${baseUrl}/api/analytics/top_holders-movements/`,
          payload
        );
        const data = response.data;

        if (!!data.ecxeption) {
          const errorText = data.ecxeption;
          console.error("Error response:", errorText);
          throw new Error(
            `Failed to fetch token whales activity data: ${response.status} ${errorText}`
          );
        }
        return data;
      } catch (error) {
        console.error("Error in useTokenWhalesActivity:", error);
        throw error;
      }
    },
  });
};

export type UpcomingUnstakingReport = {
  report_for_336h: string;
  exception: string | null;
};

export const useUpcomingUnstakingReport = (
  address: string,
  isEnabled: boolean
) => {
  const baseUrl = process.env.NEXT_PUBLIC_AGENT_SERVER_URL;
  return useQuery<UpcomingUnstakingReport>({
    queryKey: ["upcoming-unstaking-report", address],
    enabled: isEnabled,
    retry: 3,
    refetchOnWindowFocus: false,
    gcTime: 300000,
    refetchInterval: 3 * 60 * 1000,
    staleTime: 3 * 60 * 1000, // 3 minutes
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    queryFn: async () => {
      try {
        const payload = { token_address: address };
        const response = await axios.post(
          `${baseUrl}/api/analytics/upcoming-unstaking/`,
          payload
        );
        const data = response.data;

        if (!!data.ecxeption) {
          const errorText = data.ecxeption;
          console.error("Error response:", errorText);
          throw new Error(
            `Failed to fetch upcoming unstaking report data: ${response.status} ${errorText}`
          );
        }
        return data;
      } catch (error) {
        console.error("Error in useUpcomingUnstakingReport:", error);
        throw error;
      }
    },
  });
};

export type EcosystemMovementsReportType = "smart_money" | "virgen";
export const useEcosystemMovementsReport = (
  address: string,
  isEnabled: boolean,
  service_type: EcosystemMovementsReportType
) => {
  const baseUrl = process.env.NEXT_PUBLIC_AGENT_SERVER_URL;
  return useQuery<TokenWhalesReport>({
    queryKey: ["ecosystem-movements-report", address, service_type],
    enabled: isEnabled,
    retry: 3,
    refetchOnWindowFocus: false,
    gcTime: 300000,
    refetchInterval: 3 * 60 * 1000,
    staleTime: 3 * 60 * 1000, // 3 minutes
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    queryFn: async () => {
      try {
        const payload = { token_address: address, service_type };
        const response = await axios.post(
          `${baseUrl}/api/analytics/ecosystem-movements/`,
          payload
        );
        const data = response.data;

        if (!!data.ecxeption) {
          const errorText = data.ecxeption;
          console.error("Error response:", errorText);
          throw new Error(
            `Failed to fetch ecosystem movements report data: ${response.status} ${errorText}`
          );
        }
        return data;
      } catch (error) {
        console.error("Error in useEcosystemMovementsReport:", error);
        throw error;
      }
    },
  });
};

export const useDevMovementsReport = (
  address: string,
  isEnabled: boolean,
  network: string
) => {
  const baseUrl = process.env.NEXT_PUBLIC_AGENT_SERVER_URL;
  return useQuery<TokenWhalesReport>({
    queryKey: ["dev-movements-report", address, network],
    enabled: isEnabled,
    retry: 3,
    refetchOnWindowFocus: false,
    gcTime: 300000,
    refetchInterval: 3 * 60 * 1000,
    staleTime: 3 * 60 * 1000, // 3 minutes
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    queryFn: async () => {
      try {
        const payload = { token_address: address, network };
        const response = await axios.post(
          `${baseUrl}/api/analytics/dev-movements/`,
          payload
        );
        const data = response.data;
        console.log(data);

        if (!!data.ecxeption) {
          const errorText = data.ecxeption;
          console.error("Error response:", errorText);
          throw new Error(
            `Failed to fetch dev movements report data: ${response.status} ${errorText}`
          );
        }
        return data;
      } catch (error) {
        console.error("Error in useDevMovementsReport:", error);
        throw error;
      }
    },
  });
};

export type AgentResponse = {
  report: string;
  token_summary: any;
  quotes: {
    id: number;
    geneis_id: number;
    symbol: string;
    name: string;
    price_usd: string;
    market_cap_usd: number;
    ath_price_usd: string;
    change_24h: string;
  };
};

export const useGenesisTokenReport = (
  address: string | undefined,
  isClosed: boolean
) => {
  const baseUrl = process.env.NEXT_PUBLIC_AGENT_SERVER_URL;
  return useQuery<AgentResponse>({
    queryKey: ["agent-genesis-tokens-analytics", address],
    enabled: !isClosed && !!address,
    retry: 3,
    gcTime: 300000,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000, // 3 minutes
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    queryFn: async () => {
      try {
        console.log(address, "isClosed", isClosed);

        const response = await axios.post(
          `${baseUrl}/api/analytics/genesis-tokens/?address=${address?.toLowerCase()}`
        );
        const data = response.data;

        if (!data.report || !data) {
          const errorText = "Something is wrong. Please try again later.";
          console.error("Error response:", errorText);
          throw new Error(
            `Failed to fetch genesis analytics data: ${response.status} ${errorText}`
          );
        }
        return data;
      } catch (error) {
        console.error("Error in useGenesisTokenReport:", error);
        throw error;
      }
    },
  });
};
