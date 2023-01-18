import _kebabCase from 'lodash/kebabCase';

import { Typography, Card, PercentageProgress } from 'shared/ui/component-library';
import { RichText, CFLink } from 'shared/ui/cms/content';
import { AccessibilityMetricApiModel, PercentageBlockApiModel } from 'shared/api/api-types';
import { useRouter } from 'next/router';
import { localesWithTerritory } from 'shared/utils/locale';
import { LOCALE_CODE } from 'shared/api/contentful/contentful-types';
import { useRoute } from 'shared/useRoute';

export type PercentageBlockProps = {
  block: PercentageBlockApiModel;
};

function getMetricText(metric: AccessibilityMetricApiModel, locale?: string) {
  const formattedNumber = metric.number.toLocaleString(locale);
  return `${formattedNumber}${metric.isPercentage ? '%' : ''}`;
}

export function PercentageBlock({ block }: PercentageBlockProps) {
  const router = useRouter();
  const { path } = useRoute();
  const locale = router.locale ? localesWithTerritory[router.locale as LOCALE_CODE] : undefined;
  /**
   * Render a single metric as a large percentage/number with text
   */
  function renderMetric() {
    const metric = block.metrics[0];
    return (
      <>
        {metric.isPercentage && <PercentageProgress className="mb-4" percentage={metric.number} />}
        <div className="flex flex-col sm:flex-row">
          <Typography className="mr-0 break-all sm:mr-8" tag="p" size="heading-xl">
            {getMetricText(metric, locale)}
          </Typography>
          <RichText className="flex-1" text={block.text} noTopMargin noBottomMargin />
        </div>
      </>
    );
  }

  /**
   * Render multiple metrics as text and a descending bar chart
   */
  function renderMetrics() {
    const baseValue = block.baseValue ?? Math.max(...block.metrics.map(metric => metric.number));

    return (
      <div className="flex flex-col md:flex-row">
        <RichText className="flex-1 mb-4 md:mb-0 md:mr-8" text={block.text} noTopMargin noBottomMargin id={block.id} />
        <ul className="flex-1" aria-labelledby={block.id}>
          {block.metrics
            .sort((a, b) => b.number - a.number)
            .map(metric => {
              const id = `${_kebabCase(metric.title)}-${metric.number}`;
              const metricProgressPercentage = metric.isPercentage ? metric.number : (metric.number / baseValue) * 100;
              const metricLabel = `${metric.title} ${getMetricText(metric, locale)}`;

              return (
                <li key={id} aria-label={metricLabel}>
                  <Typography tag="p" size="paragraph">
                    {metric.title}
                  </Typography>
                  <div className="flex items-center -mt-3">
                    <PercentageProgress className="mr-4 flex-1" percentage={metricProgressPercentage} />
                    <Typography className="flex-grow-0" tag="p" size="paragraph">
                      {getMetricText(metric, locale)}
                    </Typography>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    );
  }

  return (
    <Card className="flex-1">
      {block.metrics.length === 1 ? renderMetric() : renderMetrics()}
      {block.link && path !== block.link.page?.url && (
        <div className="flex justify-end mt-4">
          <CFLink link={block.link} />
        </div>
      )}
    </Card>
  );
}
