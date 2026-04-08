export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="border-t border-border/30 py-12"
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-primary font-heading font-bold text-xs">R</span>
          </div>
          <span className="font-heading font-medium text-sm text-foreground">
            Rupert Joel
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Rupert Joel. Built for creators who'd rather create.
        </p>
      </div>
    </footer>
  );
}
