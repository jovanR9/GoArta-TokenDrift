import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { MagicCard } from "./magicui/magic-card";
import { Review } from './UserReviewsSection';

export const UserReviews = ({ review }: { review: Review }) => {
  const { theme } = useTheme();

  return (
    <MagicCard
      gradientColor={theme === "dark" ? "#024102" : "#024102"} // Changed gradientColor to green
      className="p-4 flex flex-col justify-between h-full rounded-[40px]" // Added rounded-[40px]
    >
      <div className="absolute inset-px rounded-[19px] bg-[#024102] dark:bg-[#024102]" /> {/* Changed background color */}
      <div className="flex items-center gap-2 mb-4">
        {review.userPhoto && (
          <img src={review.userPhoto} alt={review.userName} className="w-12 h-12 rounded-full object-cover" />
        )}
        <div>
          {review.userName && <p className="font-semibold text-lg">{review.userName}</p>}{review.rating && (
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={cn("w-5 h-5", i < review.rating ? "text-yellow-400" : "text-gray-300")}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}
        </div>
      </div>
      {review.reviewText && <p className="text-base text-neutral-600 dark:text-neutral-400 flex-grow">{review.reviewText}</p>}
      {review.logoSrc && (
        <img src={review.logoSrc} alt="Logo" className="w-20 h-auto mt-4 self-end" />
      )}
    </MagicCard>
  );
};