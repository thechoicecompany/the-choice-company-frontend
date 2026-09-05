import type { ApiResponse, PagedResponse, DemoOrderSummaryDto, DemoOrderDetailDto } from "@/lib/types/admin.types";

import { adminApi } from "../client";

export async function fetchAdminDemoOrders(
    page = 0,
    size = 20,
    status?: string,
    search?: string,
): Promise<PagedResponse<DemoOrderSummaryDto>> {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.set("status", status);
    if (search) params.set("search", search);

    const res = await adminApi.get<ApiResponse<PagedResponse<DemoOrderSummaryDto>>>(
        `/api/admin/demo-orders?${params}`
    );
    return res.data.data;
}

export async function fetchAdminDemoOrder(
    orderId: string
): Promise<DemoOrderDetailDto> {
    const res = await adminApi.get<ApiResponse<DemoOrderDetailDto>>(
        `/api/admin/demo-orders/${orderId}`
    );
    return res.data.data;
}
export async function updateDemoOrderStatus(
    orderId: string,
    payload: { status: string; trackingNumber?: string; courierName?: string; note?: string }
): Promise<DemoOrderDetailDto> {
    const res = await adminApi.patch<ApiResponse<DemoOrderDetailDto>>(
        `/api/admin/demo-orders/${orderId}/status`,
        payload
    );
    return res.data.data;
}