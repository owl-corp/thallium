import { Voucher as VoucherType } from "../api/vouchers";
import styled from "styled-components";

interface VoucherProps {
    voucher: VoucherType;
}

const VoucherContainer = styled.div`
background: linear-gradient(45deg, ${(props) => props.theme.accent}99 0%, ${(props) => props.theme.accent}ff 100%);
color: white;
padding: 1.5rem;
margin-top: 1rem;
padding-left: 4rem;
padding-right: 4rem;
/* zig-zag mask */
--mask:
    conic-gradient(from   45deg at left,  #0000,#000 1deg 89deg,#0000 90deg) left /51% 15px repeat-y,
    conic-gradient(from -135deg at right, #0000,#000 1deg 89deg,#0000 90deg) right/51% 15px repeat-y;

-webkit-mask: var(--mask);
mask: var(--mask);
`;

const Voucher: React.FC<VoucherProps> = ({ voucher }: VoucherProps) => {
    return (
        <VoucherContainer>
            <p><strong>Voucher:</strong> {voucher.voucher_code}<br />
                <strong>Balance:</strong> ${voucher.balance} USD</p>
        </VoucherContainer>
    );
};

export default Voucher;
