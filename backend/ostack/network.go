package ostack

import (
	"github.com/gophercloud/gophercloud"
	"github.com/gophercloud/gophercloud/openstack"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/extensions/networks"
	"github.com/gophercloud/gophercloud/pagination"
)

type Network struct {
	Client *gophercloud.ServiceClient
}

func (provider *Provider) Network() *Network {
	client, err := openstack.NewComputeV2(provider.ProviderClient, gophercloud.EndpointOpts{
		Region: "RegionOne",
	})
	if err != nil {
		panic(err)
	}
	return &Network{Client: client}
}

func (i *Network) List() ([]networks.Network, error) {
	pager := networks.List(i.Client)
	var result []networks.Network
	err := pager.EachPage(func(page pagination.Page) (bool, error) {
		networkList, err := networks.ExtractNetworks(page)
		if err != nil {
			return false, err
		}
		for _, network := range networkList {
			result = append(result, network)
		}
		return true, nil
	})
	return result, err
}

func (i *Network) Get(id string) (*networks.Network, error) {
	return networks.Get(i.Client, id).Extract()
}
