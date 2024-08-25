import styled from "styled-components";

const MaxWidthContainer = styled.div<{ maxWidth?: number }>`
max-width: ${({ maxWidth }) => maxWidth ? `${maxWidth.toString()}px` : "800px"};
width: 100%;
`;

export default MaxWidthContainer;
