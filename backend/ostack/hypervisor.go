package ostack

import (
	"github.com/gophercloud/gophercloud"
	"github.com/gophercloud/gophercloud/openstack"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/extensions/hypervisors"
)

type Hypervisor struct {
	Client *gophercloud.ServiceClient
}

func (provider *Provider) Hypervisor() *Hypervisor {
	client, err := openstack.NewComputeV2(provider.ProviderClient, gophercloud.EndpointOpts{
		Region: "RegionOne",
	})
	if err != nil {
		panic(err)
	}
	return &Hypervisor{Client: client}
}

func (i *Hypervisor) GetStatistics() (*hypervisors.Statistics, error) {
	return hypervisors.GetStatistics(i.Client).Extract()
}
