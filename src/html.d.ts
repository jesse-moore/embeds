declare module "*.png" {
  const content: string;
  export default content;
}
declare module "*.html" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  import { ReactElement, SVGProps } from "react";
  const content: (props: SVGProps<SVGElement>) => ReactElement;
  export default content;
}
