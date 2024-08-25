import { get, APIMissingTokenError } from "./client";
import store from "../store";

export interface Variant {
    variant_id: number;
    name: string;
    size: string;
    colour?: string;
    colour_code?: string;
    colour_code2?: string;
    price: string;
    last_synced: string;
}

export interface Template {
    template_id: number;
    title: string;
    product_id: number;
    mockup_file_url: string;
    last_synced: string;
    variants?: Variant[];
}

export const getTemplates = async (withVariants: boolean): Promise<Template[]> => {
    /* TODO: Handle lacking authorization */

    const token = store.getState().authorization.voucherToken;

    if (!token) {
        throw new APIMissingTokenError();
    };

    return await get(`/templates/?with_variants=${withVariants.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }) as unknown as Template[];
};
