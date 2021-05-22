import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React, { useState } from "react";
import { IManagerFolders, MyStuff } from "../lib/components/MyStuff/MyStuff";
import { StoryProvider } from "./StoryProvider";

const foldersMock: IManagerFolders = {
  Scenes: [
    {
      id: "1",
      name: "1. Assault on Tantive IV",
      group: "Star Wars",
      type: "Scene",
      lastUpdated: 1,
      original: undefined,
    },
    {
      id: "2",
      name: "2. Luke's destiny",
      group: "Star Wars",
      type: "Scene",
      lastUpdated: 1,
      original: undefined,
    },
    {
      id: "3",
      name: "3. Rescue of the princess",
      group: "Star Wars",
      type: "Scene",
      lastUpdated: 1,
      original: undefined,
    },
    {
      id: "4",
      name: "4. Sacrifice and victory",
      group: "Star Wars",
      type: "Scene",
      lastUpdated: 1,
      original: undefined,
    },
  ],
  Characters: [
    {
      id: "1",
      name: "Luke Skywalker",
      group: "Star Wars",
      type: "Character",
      lastUpdated: 1,
      original: undefined,
    },
    {
      id: "2",
      name: "Lei Organa",
      group: "Star Wars",
      type: "Character",
      lastUpdated: 1,
      original: undefined,
    },
    {
      id: "3",
      name: "Han Solo",
      group: "Star Wars",
      type: "Character",
      lastUpdated: 1,
      original: undefined,
    },
    {
      id: "4",
      name: "Chewie",
      group: "Star Wars",
      type: "Character",
      lastUpdated: 1,
      original: undefined,
    },
    {
      id: "5",
      name: "Anng",
      group: "Avatar",
      type: "Character",
      lastUpdated: 1,
      original: undefined,
    },
    {
      id: "6",
      name: "Toph",
      group: "Avatar",
      type: "Character",
      lastUpdated: 1,
      original: undefined,
    },
    {
      id: "7",
      name: "Soka",
      group: "Avatar",
      type: "Character",
      lastUpdated: 1,
      original: undefined,
    },
    {
      id: "8",
      name: "Karata",
      group: "Avatar",
      type: "Character",
      lastUpdated: 1,
      original: undefined,
    },
  ],
};

function StorybookMyStuff(props: {
  folders: IManagerFolders;
  search: string;
  canGoBack: boolean;
  folder: string | undefined;
}) {
  const [open, setOpen] = useState(true);

  return (
    <>
      <MyStuff<"Scenes" | "Characters">
        open={open}
        onClose={() => setOpen(false)}
        search={props.search}
        folder={props.folder}
        canGoBack={props.canGoBack}
        folders={props.folders}
        onSelect={action("onSelect")}
        onAdd={action("onAdd")}
        onDelete={action("onDelete")}
        onDuplicate={action("onDuplicate")}
        onUndo={action("onUndo")}
        onImport={action("onImport")}
        onExport={action("onExport")}
      />
    </>
  );
}

type IProps = Parameters<typeof StorybookMyStuff>["0"];

export default {
  title: "Main/MyStuff",
  component: StorybookMyStuff,
  args: {
    folder: undefined,
    search: "",
    canGoBack: true,
    folders: { Scenes: [], Characters: [] },
  },
} as Meta<IProps>;

const Template: Story<IProps> = (args, context) => {
  return (
    <StoryProvider theme={context.globals.theme}>
      <Box width="500px">
        <Paper>
          <Box>
            <StorybookMyStuff
              search={args.search}
              folder={args.folder}
              folders={args.folders}
              canGoBack={args.canGoBack}
            />
          </Box>
        </Paper>
      </Box>
    </StoryProvider>
  );
};

export const EmptyRoot = Template.bind({});
EmptyRoot.args = {};

export const EmptyInsideFolder = Template.bind({});
EmptyInsideFolder.args = {
  folder: "Characters",
};

export const Folders = Template.bind({});
Folders.args = {
  folders: foldersMock,
};

export const Folder = Template.bind({});
Folder.args = {
  folders: foldersMock,
  folder: "Characters",
};

export const FolderCantGoBack = Template.bind({});
FolderCantGoBack.args = {
  folders: foldersMock,
  canGoBack: false,
  folder: "Characters",
};

export const SearchCharacter = Template.bind({});
SearchCharacter.args = {
  folders: foldersMock,
  folder: undefined,
  search: "Luke",
};

export const SearchGroup = Template.bind({});
SearchGroup.args = {
  folders: foldersMock,
  folder: undefined,
  search: "Avatar",
};
