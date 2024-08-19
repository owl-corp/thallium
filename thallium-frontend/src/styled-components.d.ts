import type { Theme } from "./themes";
import { CSSProp } from "styled-components";

declare module "styled-components" {
    export interface DefaultTheme extends Theme { }
}

declare module "react" {
    interface Attributes {
        css?: CSSProp;
    }
}
