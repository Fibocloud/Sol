package ostack

import (
	"github.com/gophercloud/gophercloud"
	"github.com/gophercloud/gophercloud/openstack"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/flavors"
	"github.com/gophercloud/gophercloud/pagination"
)

type Flavor struct {
	Client *gophercloud.ServiceClient
}

func (provider *Provider) Flavor() *Flavor {
	client, err := openstack.NewComputeV2(provider.ProviderClient, gophercloud.EndpointOpts{
		Region: "RegionOne",
	})
	if err != nil {
		panic(err)
	}
	return &Flavor{Client: client}
}

func (i *Flavor) List() ([]flavors.Flavor, error) {
	pager := flavors.ListDetail(i.Client, flavors.ListOpts{})
	var result []flavors.Flavor
	err := pager.EachPage(func(page pagination.Page) (bool, error) {
		flavorList, err := flavors.ExtractFlavors(page)
		if err != nil {
			return false, err
		}
		for _, flavor := range flavorList {
			result = append(result, flavor)
		}
		return true, nil
	})
	return result, err
}

func (i *Flavor) Get(id string) (*flavors.Flavor, error) {
	return flavors.Get(i.Client, id).Extract()
}

type FlavorCreateInput struct {
	Name       string  `json:"name" binding:"required"`
	RAM        int     `json:"ram" binding:"required"`
	VCPUs      int     `json:"vcp_us" binding:"required"`
	RxTxFactor float64 `json:"rx_tx_factor"`
	Disk       *int    `json:"disk"`
	Swap       *int    `json:"swap"`
	IsPublic   *bool   `json:"is_public"`
	Ephemeral  *int    `json:"ephemeral"`
}

func (i *Flavor) Create(input FlavorCreateInput) (*flavors.Flavor, error) {
	return flavors.Create(i.Client, flavors.CreateOpts{
		Name:       input.Name,
		RAM:        input.RAM,
		VCPUs:      input.VCPUs,
		Disk:       input.Disk,
		Swap:       input.Swap,
		RxTxFactor: input.RxTxFactor,
		IsPublic:   input.IsPublic,
		Ephemeral:  input.Ephemeral,
	}).Extract()
}

func (i *Flavor) Delete(id string) error {
	return flavors.Delete(i.Client, id).ExtractErr()
}
