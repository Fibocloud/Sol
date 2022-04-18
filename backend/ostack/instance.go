package ostack

import (
	"github.com/gophercloud/gophercloud"
	"github.com/gophercloud/gophercloud/openstack"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/extensions/bootfromvolume"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/extensions/keypairs"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/extensions/startstop"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/servers"
	"github.com/gophercloud/gophercloud/pagination"
)

type Instance struct {
	Client *gophercloud.ServiceClient
}

func (provider *Provider) Instance() *Instance {
	client, err := openstack.NewComputeV2(provider.ProviderClient, gophercloud.EndpointOpts{
		Region: "RegionOne",
	})
	if err != nil {
		panic(err)
	}
	return &Instance{Client: client}
}

func (i *Instance) List() ([]servers.Server, error) {
	pager := servers.List(i.Client, servers.ListOpts{})
	var result []servers.Server
	err := pager.EachPage(func(page pagination.Page) (bool, error) {
		serverList, err := servers.ExtractServers(page)
		if err != nil {
			return false, err
		}
		for _, server := range serverList {
			result = append(result, server)
		}
		return true, nil
	})
	return result, err
}

func (i *Instance) Get(id string) (*servers.Server, error) {
	return servers.Get(i.Client, id).Extract()
}

type InstanceUpdateInput struct {
	Name       string
	AccessIPv4 string
	AccessIPv6 string
}

func (i *Instance) Update(id string, params InstanceUpdateInput) (*servers.Server, error) {
	return servers.Update(i.Client, id, servers.UpdateOpts{
		Name:       params.Name,
		AccessIPv4: params.AccessIPv4,
		AccessIPv6: params.AccessIPv6,
	}).Extract()
}

func (i *Instance) Delete(id string) error {
	return servers.Delete(i.Client, id).ExtractErr()
}

func (i *Instance) ChangeAdminPassword(id, password string) error {
	return servers.ChangeAdminPassword(i.Client, id, password).ExtractErr()
}

func (i *Instance) Reboot(id string, hard bool) error {
	how := servers.SoftReboot
	if hard {
		how = servers.SoftReboot
	}
	return servers.Reboot(i.Client, id, servers.RebootOpts{Type: how}).ExtractErr()
}

func (i *Instance) Resize(id, favorID string) error {
	return servers.Resize(i.Client, id, servers.ResizeOpts{FlavorRef: favorID}).ExtractErr()
}

func (i *Instance) ConfirmResize(id string) error {
	return servers.ConfirmResize(i.Client, id).ExtractErr()
}

func (i *Instance) RevertResize(id string) error {
	return servers.RevertResize(i.Client, id).ExtractErr()
}

func (i *Instance) Start(id string) error {
	return startstop.Start(i.Client, id).ExtractErr()
}

func (i *Instance) Stop(id string) error {
	return startstop.Stop(i.Client, id).ExtractErr()
}

type InstanceCreateInput struct {
	SourceType          bootfromvolume.SourceType
	SourceID            string
	Name                string
	FlavorID            string
	keypairName         string
	NetworkID           string
	VolumeSize          int
	DeleteOnTermination bool
	SecurityGroups      []string
	UserData            []byte
}

func (i *Instance) Create(input InstanceCreateInput) (*servers.Server, error) {
	return bootfromvolume.Create(i.Client, bootfromvolume.CreateOptsExt{
		CreateOptsBuilder: keypairs.CreateOptsExt{
			KeyName: input.keypairName,
			CreateOptsBuilder: servers.CreateOpts{
				Name:             input.Name,
				FlavorRef:        input.FlavorID,
				SecurityGroups:   input.SecurityGroups,
				UserData:         input.UserData,
				AvailabilityZone: "RegionOne",
				Networks:         []servers.Network{{UUID: input.NetworkID}},
			},
		},
		BlockDevice: []bootfromvolume.BlockDevice{{
			SourceType:          input.SourceType,
			UUID:                input.SourceID,
			VolumeSize:          input.VolumeSize,
			DeleteOnTermination: input.DeleteOnTermination,
			DestinationType:     bootfromvolume.DestinationVolume,
		}},
	}).Extract()
}
