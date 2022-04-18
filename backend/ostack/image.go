package ostack

import (
	"github.com/gophercloud/gophercloud"
	"github.com/gophercloud/gophercloud/openstack"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/images"
	"github.com/gophercloud/gophercloud/pagination"
)

type Image struct {
	Client *gophercloud.ServiceClient
}

func (provider *Provider) Image() *Image {
	client, err := openstack.NewComputeV2(provider.ProviderClient, gophercloud.EndpointOpts{
		Region: "RegionOne",
	})
	if err != nil {
		panic(err)
	}
	return &Image{Client: client}
}

func (i *Image) List() ([]images.Image, error) {
	pager := images.ListDetail(i.Client, images.ListOpts{})
	var result []images.Image
	err := pager.EachPage(func(page pagination.Page) (bool, error) {
		imageList, err := images.ExtractImages(page)
		if err != nil {
			return false, err
		}
		for _, image := range imageList {
			result = append(result, image)
		}
		return true, nil
	})
	return result, err
}

func (i *Image) Get(id string) (*images.Image, error) {
	return images.Get(i.Client, id).Extract()
}

func (i *Image) Delete(name string) error {
	return images.Delete(i.Client, name).ExtractErr()
}
