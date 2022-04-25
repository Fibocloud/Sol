package ostack

import (
	"github.com/gophercloud/gophercloud"
	"github.com/gophercloud/gophercloud/openstack"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/extensions/secgroups"
	"github.com/gophercloud/gophercloud/pagination"
)

type SecGroup struct {
	Client *gophercloud.ServiceClient
}

func (provider *Provider) SecGroup() *SecGroup {
	client, err := openstack.NewComputeV2(provider.ProviderClient, gophercloud.EndpointOpts{
		Region: "RegionOne",
	})
	if err != nil {
		panic(err)
	}
	return &SecGroup{Client: client}
}

func (i *SecGroup) List() ([]secgroups.SecurityGroup, error) {
	pager := secgroups.List(i.Client)
	var result []secgroups.SecurityGroup
	err := pager.EachPage(func(page pagination.Page) (bool, error) {
		secGroup, err := secgroups.ExtractSecurityGroups(page)
		if err != nil {
			return false, err
		}
		for _, item := range secGroup {
			result = append(result, item)
		}
		return true, nil
	})
	return result, err
}

func (i *SecGroup) Get(id string) (*secgroups.SecurityGroup, error) {
	return secgroups.Get(i.Client, id).Extract()
}

type SecGroupCreateInput struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
}

func (i *SecGroup) Create(input SecGroupCreateInput) (*secgroups.SecurityGroup, error) {
	return secgroups.Create(i.Client, secgroups.CreateOpts{
		Name:        input.Name,
		Description: input.Description,
	}).Extract()
}

type SecGroupUpdateInput struct {
	Name        string  `json:"name" binding:"required"`
	Description *string `json:"description"`
}

func (i *SecGroup) Update(id string, input SecGroupUpdateInput) (*secgroups.SecurityGroup, error) {
	return secgroups.Update(i.Client, id, secgroups.UpdateOpts{
		Name:        input.Name,
		Description: input.Description,
	}).Extract()
}

func (i *SecGroup) Delete(id string) error {
	return secgroups.Delete(i.Client, id).ExtractErr()
}

func (i *SecGroup) AddServer(instanceID, id string) error {
	return secgroups.AddServer(i.Client, instanceID, id).ExtractErr()
}

func (i *SecGroup) RemoveServer(instanceID, id string) error {
	return secgroups.RemoveServer(i.Client, instanceID, id).ExtractErr()
}

type SecGroupCreateRuleInput struct {
	SecGroupID  string `json:"sec_group_id" binding:"required"`
	FromPort    int    `json:"from_port"`
	ToPort      int    `json:"to_port"`
	IPProtocol  string `json:"ip_protocol"`
	CIDR        string `json:"cidr"`
	FromGroupID string `json:"group_id"`
}

func (i *SecGroup) CreateRule(input SecGroupCreateRuleInput) (*secgroups.Rule, error) {
	return secgroups.CreateRule(i.Client, secgroups.CreateRuleOpts{
		ParentGroupID: input.SecGroupID,
		FromPort:      input.FromPort,
		ToPort:        input.ToPort,
		IPProtocol:    input.IPProtocol,
		CIDR:          input.CIDR,
		FromGroupID:   input.FromGroupID,
	}).Extract()
}

func (i *SecGroup) DeleteRule(id string) error {
	return secgroups.DeleteRule(i.Client, id).ExtractErr()
}
