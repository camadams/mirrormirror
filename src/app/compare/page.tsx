"use client";
import { forwardRef, Suspense } from "react";
import { Character } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCharacters,
  calculateWinner,
  getScoringAttributes,
} from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useReward } from "react-rewards";
import { useEffect, useState, useRef } from "react";
import SafeImage from "@/components/SafeImage";

export default function Compare() {
  return (
    <div className="items-center w-full font-[family-name:var(--font-geist-sans)]">
      <Suspense fallback={<div>Loading...</div>}>
        <Main />
      </Suspense>
    </div>
  );
}

function Main() {
  const searchParams = useSearchParams();
  const characters = searchParams.get("characters") || "";
  const characterNames = characters.split(",");
  const character1Name = characterNames[0];
  const character2Name = characterNames[1];

  const {
    data,
    isLoading: character1IsLoading,
    error,
  } = useQuery({
    queryKey: ["character1", character1Name],
    queryFn: () => fetchCharacters(1, character1Name),
    enabled: !!character1Name,
  });

  const character1 = data?.characters[0];

  const {
    data: data2,
    error: error2,
    isLoading: character2IsLoading,
  } = useQuery({
    queryKey: ["character2", character2Name],
    queryFn: () => fetchCharacters(1, character2Name),
    enabled: !!character2Name,
  });

  const character2 = data2?.characters[0];

  const [showOverlay, setShowOverlay] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const character1Ref = useRef<HTMLDivElement>(null);
  const character2Ref = useRef<HTMLDivElement>(null);
  const rewardIdRef = useRef<string>("rewardId");

  const { reward } = useReward(rewardIdRef.current, "confetti", {
    spread: 180,
    startVelocity: 20,
    colors: [
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ],
    elementCount: 200,
    lifetime: 300,
    elementSize: 12,
  });

  useEffect(() => {
    if (
      character1 &&
      character2 &&
      !character1IsLoading &&
      !character2IsLoading &&
      !isCelebrating
    ) {
      const winner = calculateWinner(character1, character2);
      setWinnerIndex(winner);

      if (winner >= 0) {
        setIsCelebrating(true);

        const winnerRef = winner === 0 ? character1Ref : character2Ref;

        setTimeout(() => {
          if (winnerRef.current) {
            const rewardElement = document.getElementById(rewardIdRef.current);
            if (rewardElement) {
              const rect = winnerRef.current.getBoundingClientRect();
              rewardElement.style.position = "fixed";
              rewardElement.style.top = `${rect.top + rect.height / 2}px`;
              rewardElement.style.left = `${rect.left + rect.width / 2}px`;
              rewardElement.style.transform = "translate(-50%, -50%)";
              rewardElement.style.zIndex = "50";
            }
          }

          setShowOverlay(true);
          reward();

          setTimeout(() => {
            setShowOverlay(false);
          }, 5000);
        }, 1000);
      }
    }
  }, [
    character1,
    character2,
    character1IsLoading,
    character2IsLoading,
    isCelebrating,
    reward,
    character1Ref,
    character2Ref,
    rewardIdRef,
  ]);

  useEffect(() => {
    setIsCelebrating(false);
  }, [character1Name, character2Name]);

  if (error || error2) {
    return (
      <div className="text-center p-8 text-destructive">
        Error loading character data
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Character Selection Prompt */}
      {!character1Name || !character2Name ? (
        <div className="bg-muted rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">No Characters Selected</h2>
          <p className="text-muted-foreground mb-4">
            Please select two characters to compare their strengths.
          </p>
        </div>
      ) : (
        <>
          {/* Hidden span for confetti animation to attach to */}
          <span id={rewardIdRef.current} className="absolute" />
          <ComparisonContent />
        </>
      )}
    </div>
  );

  function ComparisonContent() {
    const attributes = getScoringAttributes(character1, character2);
    return (
      <div className="bg-card rounded-lg shadow-lg p-6">
        {/* Character Names and Images Header */}
        <div className="grid grid-cols-3 gap-4 items-center">
          <CharacterHeader
            character={character1}
            isLoading={character1IsLoading}
            isWinner={winnerIndex === 0}
            isTie={winnerIndex === -1}
            showOverlay={showOverlay}
            ref={character1Ref}
          />

          <div className="text-center w-16 h-16 mx-auto rounded-full bg-accent flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-accent-foreground">
              VS
            </span>
          </div>

          <CharacterHeader
            character={character2}
            isLoading={character2IsLoading}
            isWinner={winnerIndex === 1}
            isTie={winnerIndex === -1}
            showOverlay={showOverlay}
            ref={character2Ref}
          />
        </div>

        {/* Attributes Comparison */}
        <div className="bg-muted/30 rounded-lg py-2 space-y-2">
          {attributes.map((attr, index) => (
            <ComparisonRow key={attr.label} attribute={attr} index={index} />
          ))}
        </div>
      </div>
    );
  }
}

const CharacterHeader = forwardRef<
  HTMLDivElement,
  {
    character?: Character;
    isLoading?: boolean;
    isWinner?: boolean;
    isTie?: boolean;
    showOverlay?: boolean;
  }
>(function CharacterHeader(
  { character, isLoading, isWinner, isTie, showOverlay },
  ref
) {
  return isLoading ? (
    <Skeleton className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 bg-muted" />
  ) : (
    <div ref={ref} className="character-container">
      <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 bg-muted">
        {character?.imageUrl && (
          <>
            <SafeImage
              src={character.imageUrl}
              fallbackSrc="/fallback-image.PNG"
              alt={character.name || ""}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
            {isWinner && showOverlay && (
              <div className="absolute inset-0 bg-primary/30 flex items-center justify-center animate-pulse">
                <div className="bg-background rounded-full p-2">
                  <span className="text-2xl">👑</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <h2
        className={`text-xl font-bold text-center ${
          isWinner && showOverlay
            ? "text-primary animate-bounce"
            : "text-primary"
        }`}
      >
        {character?.name || ""}
        {isWinner && showOverlay && " wins!"}
      </h2>
      {isTie && (
        <div className="text-center text-sm text-muted-foreground mt-1">
          It is a tie! Both characters have the same score.
        </div>
      )}
    </div>
  );
});

function ComparisonRow({
  attribute,
  index,
}: {
  attribute: {
    label: string;
    value1?: number;
    value2?: number;
  };
  index: number;
}) {
  const value1 = attribute.value1 || 0;
  const value2 = attribute.value2 || 0;
  const isValue1Greater = value1 > value2;
  const isValue2Greater = value2 > value1;

  const getValueClass = (isGreater: boolean) => {
    if (isGreater) {
      return "text-primary font-bold";
    }
    return "";
  };

  return (
    <div
      className={`grid grid-cols-3 gap-4 items-center p-3 ${
        index % 2 === 1 ? "bg-background/60" : "bg-muted"
      } rounded-md`}
    >
      <div className={`text-center text-2xl ${getValueClass(isValue1Greater)}`}>
        {value1} {attribute.label === "Motion Diversity" ? "/4" : ""}
      </div>
      <div className="text-center text-lg font-semibold text-secondary-foreground">
        {attribute.label}
      </div>
      <div className={`text-center text-2xl ${getValueClass(isValue2Greater)}`}>
        {value2} {attribute.label === "Motion Diversity" ? "/4" : ""}
      </div>
    </div>
  );
}
