import { and, asc, eq, inArray } from "drizzle-orm";
import { projectTable, taskRelationTable, taskTable } from "../database/schema";
import { projectAccessCondition } from "../project-access/project-access-condition";
import type { TaskReadDatabase } from "./bounded-read";

export async function getSubtaskParents(
  db: TaskReadDatabase,
  taskIds: string[],
  workspaceId: string,
  publicOnly: boolean,
  userId?: string,
) {
  const parents = new Map<string, { id: string; title: string }[]>();
  if (taskIds.length === 0) return parents;

  const rows = await db
    .select({
      taskId: taskRelationTable.targetTaskId,
      id: taskTable.id,
      title: taskTable.title,
    })
    .from(taskRelationTable)
    .innerJoin(taskTable, eq(taskRelationTable.sourceTaskId, taskTable.id))
    .innerJoin(projectTable, eq(taskTable.projectId, projectTable.id))
    .where(
      and(
        inArray(taskRelationTable.targetTaskId, taskIds),
        eq(taskRelationTable.relationType, "subtask"),
        eq(projectTable.workspaceId, workspaceId),
        publicOnly ? eq(projectTable.isPublic, true) : undefined,
        userId ? projectAccessCondition(userId, projectTable.id) : undefined,
      ),
    )
    .orderBy(asc(taskTable.id));

  for (const { taskId, id, title } of rows) {
    const linked = parents.get(taskId) ?? [];
    linked.push({ id, title });
    parents.set(taskId, linked);
  }
  return parents;
}
