import * as React from "react";
import { AvatarState } from "@/components/AvatarState";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/command";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check } from "lucide-react";

type Option = {
  value: string;
  label: string;
  avatar?: string;
};

interface VirtualizedCommandProps {
  height: string;
  options: Option[];
  placeholder: string;
  selectedOption: string;
  renderOption?: ({
    option,
    isSelected,
  }: {
    option?: Option;
    isSelected: boolean;
  }) => React.ReactNode;
  onSelectOption?: (option: string) => void;
}

const VirtualizedCommand = ({
  height,
  options,
  placeholder,
  selectedOption,
  renderOption,
  onSelectOption,
}: VirtualizedCommandProps) => {
  const [filteredOptions, setFilteredOptions] =
    React.useState<Option[]>(options);
  const parentRef = React.useRef(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const handleSearch = (search: string) => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase() ?? []),
      ),
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
    }
  };

  return (
    <Command shouldFilter={false} onKeyDown={handleKeyDown}>
      <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No item found.</CommandEmpty>
        <CommandGroup
          ref={parentRef}
          style={{
            height: height,
            width: "100%",
            overflow: "auto",
          }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualOptions.map((virtualOption) => {
              //const avatar = randomAvatar();
              const current = filteredOptions[virtualOption.index];
              return (
                <CommandItem
                  className="flex cursor-pointer items-center justify-between"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualOption.size}px`,
                    transform: `translateY(${virtualOption.start}px)`,
                  }}
                  key={filteredOptions[virtualOption.index]?.value}
                  value={filteredOptions[virtualOption.index]?.value}
                  onSelect={onSelectOption}
                >
                  {renderOption &&
                    renderOption({
                      option: filteredOptions[virtualOption.index],
                      isSelected:
                        selectedOption ===
                        filteredOptions[virtualOption.index]?.value,
                    })}
                  {!renderOption && (
                    <>
                      <div className="flex flex-row items-center gap-2">
                        <AvatarState
                          pos={
                            filteredOptions[virtualOption.index]?.label
                              .length ?? 0
                          }
                          className="h-6 w-6"
                          avatar={current?.avatar}
                        />
                        {filteredOptions[virtualOption.index]?.label}
                      </div>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedOption ===
                            filteredOptions[virtualOption.index]?.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </>
                  )}
                </CommandItem>
              );
            })}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default VirtualizedCommand;
