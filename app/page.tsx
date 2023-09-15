"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { StaticMathField, addStyles } from "react-mathquill";

let Home = null;

if (typeof window != "undefined") {
    addStyles();

    Home = function Home() {
        const [numbers, setNumbers] = useState<number[]>([]);
        const [weights, setWeights] = useState<number[]>([]);
        const [errMsg, setErrMsg] = useState<string>("");
        const numbersInputRef = useRef<HTMLInputElement>(null);
        const weightsInputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            if (weights.length > 0 && numbers.length != weights.length)
                setErrMsg(
                    `Unmatched weights (expected ${numbers.length} got ${weights.length})`
                );
            else setErrMsg("");
        }, [numbers, weights]);

        function handleObliczButtonClicked() {
            if (numbersInputRef.current != null) {
                let str = numbersInputRef.current.value.replaceAll(" ", "");
                setNumbers(str == "" ? [] : str.split(",").map(Number));
            }
            if (weightsInputRef.current != null) {
                let str = weightsInputRef.current.value.replaceAll(" ", "");
                setWeights(str == "" ? [] : str.split(",").map(Number));
            }
        }

        const numbersAddedTotal =
            numbers.length == 0
                ? null
                : numbers.reduce((total, n) => total + n, 0);
        const avg =
            numbersAddedTotal == null
                ? null
                : numbersAddedTotal / numbers.length;

        const weightsAddedTotal =
            weights.length == 0
                ? null
                : weights.reduce((total, n) => total + n, 0);
        const weightsMultipliedTotal =
            weights.length == 0
                ? null
                : weights.reduce((total, w, i) => total + w * numbers[i], 0);

        const medianNumbers: number[] = numbers.sort((a, b) => a - b);
        const medianIndices: number[] = (() => {
            const midIdx = medianNumbers.length / 2;
            if (medianNumbers.length % 2 == 0)
                // even
                return [midIdx, midIdx - 1];
            // uneven
            return [Math.floor(midIdx)];
        })();
        const medians: number[] = medianIndices.map((i) => medianNumbers[i]);

        const varianceTop =
            avg == null
                ? null
                : numbers.reduce((total, n) => total + (n - avg) ** 2, 0);
        const variance =
            varianceTop == null ? null : varianceTop / numbers.length;

        const stdDeviation = variance == null ? null : Math.sqrt(variance);

        return (
            <>
                <main className="flex flex-col p-6 gap-2">
                    <div className="bg-slate-100 p-2 rounded-lg flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex gap-4 items-center">
                                <div className="w-12">Liczby:</div>
                                <input
                                    ref={numbersInputRef}
                                    placeholder="1, 2, 3"
                                    className="bg-slate-200 p-2 rounded-lg"
                                />
                            </div>
                            <br />
                            <div className="flex gap-4 items-center">
                                <div className="w-12">Wagi:</div>
                                <input
                                    ref={weightsInputRef}
                                    placeholder="1, 2, 3"
                                    className="bg-slate-200 p-2 rounded-lg"
                                />
                            </div>
                            {errMsg != "" && (
                                <div className="text-red-500 font-semibold">
                                    Error: {errMsg}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleObliczButtonClicked}
                            className="p-2 bg-blue-500 text-slate-50 rounded-lg w-20"
                        >
                            Oblicz
                        </button>
                    </div>
                    {numbersAddedTotal != null && (
                        <div className="bg-slate-100 p-4 rounded-lg flex flex-col justify-center gap-4">
                            <h1 className="text-2xl font-semibold">
                                Średnia arytmetyczna
                            </h1>
                            <StaticMathField>{`\\overline{x} = \\frac{${numbers.join(
                                " + "
                            )}}{${
                                numbers.length
                            }} = \\frac{${numbersAddedTotal}}{${
                                numbers.length
                            }} = ${avg}`}</StaticMathField>
                        </div>
                    )}
                    {weightsAddedTotal != null &&
                        weightsMultipliedTotal != null && (
                            <div className="bg-slate-100 p-4 rounded-lg flex flex-col justify-center gap-4">
                                <h1 className="text-2xl font-semibold">
                                    Średnia ważona
                                </h1>
                                <StaticMathField>{`\\overline{x} = \\frac{${weights
                                    .map((w, i) => `${w} * ${numbers[i]}`)
                                    .join(
                                        " + "
                                    )}}{${weightsAddedTotal}} = \\frac{${weightsMultipliedTotal}}{${weightsAddedTotal}} = ${
                                    weightsMultipliedTotal / weightsAddedTotal
                                }`}</StaticMathField>
                            </div>
                        )}
                    {medianNumbers.length > 0 && (
                        <div className="bg-slate-100 p-4 rounded-lg flex flex-col justify-center gap-4">
                            <h1 className="text-2xl font-semibold">Mediana</h1>
                            <p>
                                {medianNumbers.map((n, i) => (
                                    <>
                                        {medianIndices.includes(i) ? (
                                            <u key={i}>{n}</u>
                                        ) : (
                                            n
                                        )}
                                        {i != medianNumbers.length - 1 && ", "}
                                    </>
                                ))}
                            </p>
                            <StaticMathField>{`M = ${
                                medians.length == 1
                                    ? medians[0]
                                    : `\\frac{${medians[0]} + ${
                                          medians[1]
                                      }}{2} = \\frac{${
                                          medians[0] + medians[1]
                                      }}{2} = ${(medians[0] + medians[1]) / 2}`
                            }`}</StaticMathField>
                        </div>
                    )}
                    {variance != null && avg != null && (
                        <div className="bg-slate-100 p-4 rounded-lg flex flex-col justify-center gap-4">
                            <h1 className="text-2xl font-semibold">
                                Wariancja
                            </h1>
                            <StaticMathField>{`W = \\frac{${numbers
                                .map((n) => `(${n} - ${avg})^2`)
                                .join(" + ")}}{${
                                numbers.length
                            }} = \\frac{${numbers
                                .map((n) => `(${n - avg})^2`)
                                .join(" + ")}}{${
                                numbers.length
                            }} = \\frac{${numbers
                                .map((n) => `${(n - avg) ** 2}`)
                                .join(" + ")}}{${
                                numbers.length
                            }} = \\frac{${varianceTop}}{${
                                numbers.length
                            }} = ${variance}`}</StaticMathField>
                        </div>
                    )}
                    {stdDeviation != null && (
                        <div className="bg-slate-100 p-4 rounded-lg flex flex-col justify-center gap-4">
                            <h1 className="text-2xl font-semibold">
                                Odchylenie standardowe
                            </h1>
                            <StaticMathField>{`\\sigma = \\sqrt{W} = \\sqrt{${variance}} = ${stdDeviation}`}</StaticMathField>
                        </div>
                    )}
                </main>
            </>
        );
    };
}

export default Home;
