
import { FunctionComponent } from "react";

interface Props {
    children: React.ReactNode;
}

const BaseLayout: FunctionComponent<Props> = ({children}) => {
  return (
    <div className="py-16 bg-slate-700 overflow-hidden min-h-screen">
        <div className="">
            {children}
        </div>
    </div>
  )
}

export default BaseLayout;