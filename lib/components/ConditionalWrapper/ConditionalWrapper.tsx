export const ConditionalWrapper: React.FC<{
  condition: boolean;
  wrapper(children: React.ReactNode): any;
}> = ({ condition, wrapper, children }) => {
  return condition ? wrapper(children) : children;
};
