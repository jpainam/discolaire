interface AppreciationRange {
  minGrade: number;
  maxGrade: number;
  appreciation: string;
  [key: string]: any;
}

export function useAppreciation({
  appreciations,
}: {
  appreciations: AppreciationRange[];
}) {
  return {
    getAppreciation: (grade: number): string | null => {
      let left = 0;
      let right = appreciations.length - 1;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const range = appreciations[mid];
        if (!range) {
          return null;
        }

        if (grade >= range.minGrade && grade <= range.maxGrade) {
          return range.appreciation;
        } else if (grade < range.minGrade) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      }

      return null;
    },
  };
}
