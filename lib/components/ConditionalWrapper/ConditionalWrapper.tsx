export const ConditionalWrapper: React.FC<{
  condition: boolean | undefined;
  children: React.ReactNode;
  wrapper(children: React.ReactNode): any;
}> = ({ condition, wrapper, children }) => {
  return condition ? wrapper(children) : children;
};
