import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useState } from "react";

import { Template, getTemplates } from "../api/templates";
import { APIError, APIMissingTokenError } from "../api/client";
import StoreItem from "../components/StoreItem";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Card from "../components/Card";
import LoadingBar from "../components/LoadingBar";
import CartStatus from "../components/CartStatus";
import { getCurrentVoucher, Voucher } from "../api/vouchers";
import VoucherDisplay from "../components/Voucher";
import { setMaxPrice } from "../slices/cart";
import store from "../store";


const StoreGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 2rem;
    margin-left: 1rem;
    margin-right: 1rem;
    margin-top: 2rem;
    width: 80%;
`;

const StorePage = () => {
    const voucherToken = useSelector((state: RootState) => state.authorization.voucherToken);
    const [storeItems, setStoreItems] = useState<Template[] | null>(null);
    const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentVoucher, setCurrentVoucher] = useState<Voucher | null>(null);

    useEffect(() => {
        getTemplates(true).then((items) => {
            setStoreItems(items);
            setLoading(false);
        }).catch((err: unknown) => {
            setStoreItems([]);
            setLoading(false);
            if (err instanceof APIMissingTokenError) {
                setPermissionDenied(true);
            } else if (err instanceof APIError) {
                if ([401, 403].includes(err.status)) {
                    setPermissionDenied(true);
                }
            }
        });

        if (voucherToken) {
            getCurrentVoucher().then((voucher) => {
                setCurrentVoucher(voucher);
                store.dispatch(setMaxPrice(parseFloat(voucher.balance)));
            }).catch((err: unknown) => {
                if (err instanceof APIMissingTokenError) {
                    setPermissionDenied(true);
                } else if (err instanceof APIError) {
                    if ([401, 403].includes(err.status)) {
                        setPermissionDenied(true);
                    }
                }
            }
            );
        }
    }, [voucherToken]);

    return (
        <>
            <h1>Giveaway Store</h1>
            {!(loading || permissionDenied) && <CartStatus />}
            {currentVoucher && <Card title="Active Voucher"><VoucherDisplay voucher={currentVoucher} /></Card>}
            {loading && <LoadingBar />}
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
