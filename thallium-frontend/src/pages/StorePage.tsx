import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useState } from "react";

import { Template, getTemplates } from "../api/templates";
import { APIMissingTokenError } from "../api/client";
import StoreItem from "../components/StoreItem";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StoreGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 2rem;
    margin-left: 1rem;
    margin-right: 1rem;
`;

const StorePage = () => {
    const voucherToken = useSelector((state: RootState) => state.authorization.voucherToken);
    const [storeItems, setStoreItems] = useState<Template[] | null>(null);
    const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

    useEffect(() => {
        getTemplates(true).then(setStoreItems).catch((err: unknown) => {
            setStoreItems([]);
            if (err instanceof APIMissingTokenError) {
                setPermissionDenied(true);
            }
        });
    }, [voucherToken]);

    return (
        <>
            <h1>Giveaway Store</h1>
            <StoreGrid>
                {storeItems?.map((item) => (
                    <StoreItem key={item.template_id} template={item} />
                ))}
            </StoreGrid>
            {permissionDenied && (
                <>
                    <p>You need to have a valid voucher code to access the store.</p>
                    <Link to="/">Redeem a voucher</Link>
                </>
            )}
        </>
    );
};

export default StorePage;
