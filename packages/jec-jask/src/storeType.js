// @flow

export type ID = string

export type TagPair = {
	+tagId: ID,
	+objId: ID,
}

export type Project = {
	+name: string,
	+parent: ID,
}

export type Priorities = "H" | "M" | "L"

export type BlockedBy = { [ID]: ID, }
export type Descriptions = { [ID]: string, }
export type Done = { [ID]: string, }
export type Due = { [ID]: string, }
export type Objs = Array<ID>
export type Priority = { [ID]: Priorities, }
export type Projects = { [ID]: Project }
export type Recur = { [ID]: string, }
export type Start = { [ID]: string, }
export type TagPairs = Array<TagPair>
export type Tags = { [ID]: string, }
export type Wait = { [ID]: string, }

export type ReduxState = {
	+blockedBy: BlockedBy,
	+descriptions: Descriptions,
	+done: Done,
	+due: Due,
	+objs: Objs,
	+priority: Priority,
	+projects: Projects,
	+recur: Recur,
	+start: Start,
	+tagPairs: TagPairs,
	+tags: Tags,
	+wait: Wait,
}
