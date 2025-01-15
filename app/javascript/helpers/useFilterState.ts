import { useState } from "react";

export interface StateOption<S> {
    current: S;
    setter: (S) => void;
}

export function useFilterState<S>(init: S, handleSet: (S) => void | undefined = undefined as any): StateOption<S> {
    const [current, setter] = useState(init);

    if (handleSet === undefined) {
        return { current, setter }
    }
    const setHelper = (v) => {
        setter(v);
        handleSet(v);
    }
    return { current: current, setter: setHelper };
}
