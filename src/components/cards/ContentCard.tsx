import { Link } from "react-router";
import { cn, slugify } from "@/lib/utils";
import { registrationPath } from "@/lib/routes";
import type { ContentCardType } from "@/types/content-card";
import { useTranslation } from "react-i18next";

export function ContentCard({
  content,
  className,
  id = slugify(content.title),
}: {
  content: ContentCardType;
  className?: string;
  id?: string;
}) {
  const { i18n } = useTranslation();
  const link = registrationPath(content.id, i18n.resolvedLanguage ?? "en");
  return (
    <article
      id={`content-card-${id}`}
      className={cn(
        "content-card relative flex w-full max-w-sm flex-col overflow-hidden",
        "rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10",
        "transition-shadow focus-within:ring-2 focus-within:ring-epfl-accent hover:shadow-lg",
        className,
      )}
      aria-labelledby={`content-card-${id}-title`}
    >
      <img
        className="content-card-picture aspect-video w-full object-cover"
        src={content.picture}
        alt=""
        loading="lazy"
      />
      <div className="flex flex-col gap-2 p-5">
        <h3
          id={`content-card-${id}-title`}
          className="content-card-title font-heading text-xl font-semibold tracking-tight"
        >
          <Link
            to={link}
            className="after:absolute after:inset-0 hover:text-epfl-accent focus-visible:outline-none"
          >
            {content.title}
          </Link>
        </h3>
        <p className="content-card-description text-sm text-muted-foreground">
          {content.description}
        </p>
      </div>
    </article>
  );
}
