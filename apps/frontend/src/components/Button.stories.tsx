import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Botón común",
    variant: "default",
  },
};

export const Abort: Story = {
  args: {
    children: "Botón cancelar",
    variant: "abort",
  },
};

export const Confirm: Story = {
  args: {
    children: "Botón confirmar",
    variant: "confirm",
  },
};
