
export interface NavItem {
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface CapabilityItem {
  title: string;
  description: string;
  imageUrl: string;
  gradient: string;
}
