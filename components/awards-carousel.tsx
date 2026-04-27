import { MediaCover } from "@/components/media";
import type { Award } from "@/lib/types";

export function AwardsCarousel({ items }: { items: Award[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="awards-carousel" aria-label="Awards and recognition">
      <div className="awards-carousel__track">
        {items.map((award) => (
          <article className="award-card" key={award.slug}>
            <figure className="award-card__media">
              <MediaCover
                asset={award.coverImage}
                title={award.title}
                label={String(award.year)}
                description={award.summary}
                compact
                sizes="(max-width: 900px) 86vw, 360px"
                transformation={[
                  {
                    width: 760,
                    quality: 82
                  }
                ]}
              />
            </figure>

            <div className="award-card__body">
              <p className="award-card__event">{award.event}</p>
              <h3>{award.title}</h3>
              <p className="award-card__result">{award.result}</p>
              {award.project ? (
                <p className="award-card__project">Project: {award.project}</p>
              ) : null}
              <p>{award.summary}</p>

              {award.tags.length > 0 ? (
                <ul className="tag-list" aria-label={`${award.title} tags`}>
                  {award.tags.slice(0, 4).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              ) : null}

              {award.referenceUrl ? (
                <a
                  className="text-link"
                  href={award.referenceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View reference
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
