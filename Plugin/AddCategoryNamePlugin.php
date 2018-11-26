<?php

namespace Damcou\DemoBanner\Plugin;

use Algolia\AlgoliaSearch\Block\Configuration as AlgoliaConfig;

class AddCategoryNamePlugin
{
    /**
     * @var \Magento\Framework\View\Asset\Repository
     */
    private $assetRepository;

    /**
     * @param \Magento\Framework\View\Asset\Repository $assetRepository
     */
    public function __construct(
        \Magento\Framework\View\Asset\Repository $assetRepository
    ) {
        $this->assetRepository = $assetRepository;
    }

    public function getAssetDirectory()
    {
        return $this->assetRepository->getUrlWithParams('Damcou_DemoBanner::images', []);
    }

    public function afterGetConfiguration(AlgoliaConfig $subject, $result)
    {
        if (isset($result['urls'])) {
            $result['urls']['assetDirectory'] = $this->getAssetDirectory();
        }

        if (isset($result['instant'])) {
            $result['instant']['categoryName'] = '';
            $category = $subject->getCurrentCategory();
            if ($category && $category->getName() != '') {
                $result['instant']['categoryName'] = $category->getName();
            }
        }

        return $result;
    }
}
