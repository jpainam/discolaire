interface FormGroupProps {
  children: React.ReactNode;
  title: string;
}
export function FormGroup({ children, title }: FormGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-md bg-primary p-2 text-sm text-primary-foreground dark:bg-muted dark:text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}
