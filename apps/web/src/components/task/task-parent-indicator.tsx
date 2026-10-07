import { CornerDownRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import type Task from "@/types/task";

export default function TaskParentIndicator({
  parents,
}: {
  parents: Task["subtaskParents"];
}) {
  const { t } = useTranslation();
  if (!parents?.length) return null;
  const labels = parents.map((parent) =>
    t("tasks:subtasks.parentIndicator", { title: parent.title }),
  );

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={labels.join("; ")}
        className="ml-auto inline-flex size-5.5 shrink-0 items-center justify-center text-muted-foreground"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <CornerDownRight className="size-3.5" aria-hidden="true" />
      </TooltipTrigger>
      <TooltipPopup>
        {parents.map((parent, index) => (
          <div key={parent.id}>{labels[index]}</div>
        ))}
      </TooltipPopup>
    </Tooltip>
  );
}
