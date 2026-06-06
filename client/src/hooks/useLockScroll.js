// import { useEffect } from "react";
// export default function useLockScroll() {
//     useEffect(() => {
//         document.body.style.overflow = 'hidden';
//         return () => {
//             document.body.style.overflow = '';
//         };
//     }, []);
// }

import { useEffect } from "react";

let lockCount = 0;

export default function useLockScroll() {
    useEffect(() => {
        lockCount++;
        document.body.style.overflow = 'hidden';
        
        return () => {
            lockCount--;
            if (lockCount === 0) {
                document.body.style.overflow = '';
            }
        };
    }, []);
}