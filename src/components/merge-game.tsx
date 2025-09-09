import use2048 from "@/hooks/use2048";
import { CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

const gradient = [
  "bg-[#3c1c4a]",
  "bg-[#574084]",
  "bg-[#655ec0]",
  "bg-[#5a78e3]",
  "bg-[#549fff]",
  "bg-[#4fd8ff]",
  "bg-[#7fffff]",
  "bg-[#bfffff]",
  "bg-[#ffffff]",
  "bg-[#ffdaef]",
  "bg-[#ffa8df]",
  "bg-[#ef60bf]",
  "bg-[#e716ac]",
  "bg-[#991674]",
  "bg-[#5c024a]",
  "bg-[#300020]",
];

export default function MergeGame() {
  const { tiles, score, up, down, left, right, isGameOver, restart } =
    use2048();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);
    if (e.key === "ArrowUp") {
      up();
    } else if (e.key === "ArrowDown") {
      down();
    } else if (e.key === "ArrowLeft") {
      left();
    } else if (e.key === "ArrowRight") {
      right();
    }
  };

  return (
    <>
      <CardHeader className="text-xl font-semibold flex-row">
        <Button
          variant="secondary"
          onClick={restart}
          className="hover:cursor-pointer"
        >
          Restart
        </Button>
        <div className="text-end flex-grow">Score: {score}</div>
      </CardHeader>
      <CardContent>
        <div
          className={`grid grid-cols-4 gap-2 transition-all text-xl p-2${
            isGameOver ? " opacity-50" : ""
          }`}
          onKeyDown={handleKeyDown}
          autoFocus
          tabIndex={0}
        >
          {tiles.map((r, i) => (
            <>
              {r.map((t, idx) => (
                <div
                  className={`rounded ${
                    t > 0
                      ? gradient[Math.min(Math.log2(t), gradient.length)] +
                        " shadow-lg"
                      : "bg-secondary"
                  } aspect-square flex items-center justify-center`}
                  key={"tile-" + i + "-" + idx}
                >
                  {t}
                </div>
              ))}
            </>
          ))}
        </div>
      </CardContent>
    </>
  );
}
