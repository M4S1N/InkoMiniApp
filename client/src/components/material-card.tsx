import { cn } from "@/lib/utils";

interface MaterialCardProps {
  material: string;
  name: string;
  price: number;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export default function MaterialCard({ material, name, price, icon, selected, onClick }: MaterialCardProps) {
  return (
    <div 
      className={cn(
        "material-card border border-border rounded-lg p-4 cursor-pointer hover:border-accent transition-colors",
        selected && "selected"
      )}
      onClick={onClick}
      data-testid={`material-${material}`}
    >
      <div className="text-center">
        <div className="text-2xl text-accent mb-2 flex justify-center">
          {icon}
        </div>
        <h4 className="font-medium text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground">${price}/m²</p>
      </div>
    </div>
  );
}
