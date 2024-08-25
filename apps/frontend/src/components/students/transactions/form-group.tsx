type FormGroupProps = {
  children: React.ReactNode;
  title: string;
};
export function FormGroup({ children, title }: FormGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="p-2 dark:bg-muted dark:text-muted-foreground text-sm rounded-md bg-primary text-primary-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}
