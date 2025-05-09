"use client";
import { Character } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { fetchCharacters, calculateWinner } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { useReward } from "react-rewards";
import { useEffect, useState, useRef, forwardRef } from "react";

// Define the CharacterHeader component at the top level with forwardRef
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
            <Image
              src={character.imageUrl}
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

// Define ComparisonRow component at the top level
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
        {value1}
      </div>
      <div className="text-center text-lg font-semibold text-secondary-foreground">
        {attribute.label}
      </div>
      <div className={`text-center text-2xl ${getValueClass(isValue2Greater)}`}>
        {value2}
      </div>
    </div>
  );
}

export default function Comparison() {
  const searchParams = useSearchParams();
  const [showOverlay, setShowOverlay] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Create refs for character headers to position the confetti
  const character1Ref = useRef<HTMLDivElement>(null);
  const character2Ref = useRef<HTMLDivElement>(null);
  const rewardIdRef = useRef<string>("rewardId");

  // Configure the reward animation with longer duration
  console.log("ta ", rewardIdRef.current);
  const { reward, isAnimating } = useReward(rewardIdRef.current, "confetti", {
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

  const characters = searchParams.get("characters") || "";
  const characterNames = characters.split(",");
  const character1Name = characterNames[0];
  const character2Name = characterNames[1];

  const {
    status,
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

  // Check if we've already celebrated this comparison
  useEffect(() => {
    if (character1 && character2) {
      // Create a unique key for this character combination
      const comparisonKey = `celebrated_${character1.name}_${character2.name}`;
      const hasAlreadyCelebrated =
        localStorage.getItem(comparisonKey) === "true";
      setHasCelebrated(hasAlreadyCelebrated);
    }
  }, [character1, character2]);

  // Determine the winner when both characters are loaded
  useEffect(() => {
    if (
      character1 &&
      character2 &&
      !character1IsLoading &&
      !character2IsLoading &&
      !hasCelebrated
    ) {
      const winner = calculateWinner(character1, character2);
      setWinnerIndex(winner);

      // Only proceed with animation if there's a definitive winner (not a tie)
      if (winner >= 0) {
        // Position the reward element over the correct character
        const winnerRef = winner === 0 ? character1Ref : character2Ref;

        // Small delay to ensure DOM is ready
        setTimeout(() => {
          // Update reward to animate at the winner's position
          if (winnerRef.current) {
            const rewardElement = document.getElementById(rewardIdRef.current);
            if (rewardElement) {
              // Get viewport-relative position of the character element
              const rect = winnerRef.current.getBoundingClientRect();
              // Get scroll position
              const scrollX = window.scrollX || document.documentElement.scrollLeft;
              const scrollY = window.scrollY || document.documentElement.scrollTop;

              // Calculate absolute position (viewport + scroll)
              const absoluteLeft = rect.left + scrollX;
              const absoluteTop = rect.top + scrollY;

              // Position reward element at center of character image
              rewardElement.style.position = "fixed";
              rewardElement.style.top = `${rect.top + (rect.height / 2)}px`;
              rewardElement.style.left = `${rect.left + (rect.width / 2)}px`;
              rewardElement.style.transform = "translate(-50%, -50%)";
              rewardElement.style.zIndex = "50";
            }
          }

          setShowOverlay(true);
          reward();

          // Hide overlay after 5 seconds
          setTimeout(() => {
            setShowOverlay(false);

            // Save to localStorage that we've celebrated this comparison
            const comparisonKey = `celebrated_${character1.name}_${character2.name}`;
            localStorage.setItem(comparisonKey, "true");
            setHasCelebrated(true);
          }, 5000);
        }, 1000); // Small delay before starting animation for dramatic effect
      } else {
        // In case of a tie, just mark as celebrated but don't show animation
        const comparisonKey = `celebrated_${character1.name}_${character2.name}`;
        localStorage.setItem(comparisonKey, "true");
        setHasCelebrated(true);
      }
    }
  }, [
    character1,
    character2,
    character1IsLoading,
    character2IsLoading,
    reward,
    hasCelebrated,
  ]);

  if (error || error2) {
    return (
      <div className="text-center p-8 text-destructive">
        Error loading character data
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      {/* Hidden span for confetti animation to attach to */}
      <span id={rewardIdRef.current} className="absolute" />

      <ComparisonContent />
    </div>
  );

  function ComparisonContent() {
    // Create arrays of comparison attributes
    const attributes = [
      {
        label: "Allies",
        value1: character1?.allies?.length,
        value2: character2?.allies?.length,
      },
      {
        label: "Enemies",
        value1: character1?.enemies?.length,
        value2: character2?.enemies?.length,
      },
      {
        label: "Films",
        value1: character1?.films?.length,
        value2: character2?.films?.length,
      },
      {
        label: "Short Films",
        value1: character1?.shortFilms?.length,
        value2: character2?.shortFilms?.length,
      },
      {
        label: "TV Shows",
        value1: character1?.tvShows?.length,
        value2: character2?.tvShows?.length,
      },
      {
        label: "Video Games",
        value1: character1?.videoGames?.length,
        value2: character2?.videoGames?.length,
      },
      {
        label: "Park Attractions",
        value1: character1?.parkAttractions?.length,
        value2: character2?.parkAttractions?.length,
      },
    ];

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
