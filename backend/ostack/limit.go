package ostack

import (
	"github.com/gophercloud/gophercloud"
	"github.com/gophercloud/gophercloud/openstack"
	cinderLimit "github.com/gophercloud/gophercloud/openstack/blockstorage/extensions/limits"
	novaLimit "github.com/gophercloud/gophercloud/openstack/compute/v2/extensions/limits"
)

type Limit struct {
	Client *gophercloud.ServiceClient
}

func (provider *Provider) Limit() *Limit {
	client, err := openstack.NewComputeV2(provider.ProviderClient, gophercloud.EndpointOpts{
		Region: "RegionOne",
	})
	if err != nil {
		panic(err)
	}
	return &Limit{Client: client}
}

func (i *Limit) GetNova() (*novaLimit.Limits, error) {
	return novaLimit.Get(i.Client, novaLimit.GetOpts{}).Extract()
}

func (i *Limit) GetCinder() (*cinderLimit.Limits, error) {
	return cinderLimit.Get(i.Client).Extract()
}
